import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Filter types based on Plausible API documentation
export type SimpleFilter = 
  | [string, string, string[]]  // [operator, dimension, clauses]
  | [string, string, string[], Record<string, any>];  // [operator, dimension, clauses, modifiers]

export type LogicalFilter = 
  | ["and" | "or", Array<SimpleFilter | LogicalFilter>]
  | ["not", SimpleFilter | LogicalFilter];

export type Filter = SimpleFilter | LogicalFilter;

export interface QueryArgs {
  site_id: string;
  metrics: string[];
  date_range: string | [string, string];
  dimensions?: string[];
  filters?: Filter[];
  order_by?: [string, "asc" | "desc"][];
  include?: {
    imports?: boolean;
    time_labels?: boolean;
    total_rows?: boolean;
  };
  pagination?: {
    limit?: number;
    offset?: number;
  };
}

export const queryTool: Tool = {
  name: "plausible_query",
  description: "Query analytics data from Plausible",
  inputSchema: {
    type: "object",
    required: ["site_id", "metrics", "date_range"],
    properties: {
      site_id: {
        type: "string",
        description: "The domain of the site to query data for",
      },
      metrics: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "String list of metrics to query. Valid metrics: 'visitors' (int) - The number of unique visitors | 'visits' (int) - The number of visits/sessions | 'pageviews' (int) - The number of pageview events | 'views_per_visit' (float) - The number of pageviews divided by the number of visits | 'bounce_rate' (float) - Bounce rate percentage | 'visit_duration' (int) - Visit duration in seconds | 'events' (int) - The number of events (pageviews + custom events). When filtering by a goal, this metric corresponds to 'Total Conversions' in the dashboard | 'scroll_depth' (int) - Page scroll depth averaged per session (Requires event:page filter or dimension being set) | 'percentage' (float) - The percentage of visitors of total who fall into this category (Requires non-empty dimensions) | 'conversion_rate' (float) - The percentage of visitors who completed the goal (Requires event:goal filter or dimension being set) | 'group_conversion_rate' (float) - The percentage of visitors who completed the goal with the same dimension (Requires event:goal filter or dimension being set) | 'average_revenue' (Revenue or null) - Average revenue per revenue goal conversion (Requires revenue goals, event:goal filter or dimension for a relevant revenue goal) | 'total_revenue' (Revenue or null) - Total revenue from revenue goal conversions (Requires revenue goals, event:goal filter or dimension for a relevant revenue goal) | 'time_on_page' (int) - Average time in seconds spent on a page per visit (Requires event:page filter or dimension being set)",
      },
      date_range: {
        oneOf: [
          {
            type: "string",
            description:
              'Predefined date range: "day" (Current day) | "7d" (Last 7 days) | "28d" (Last 28 days) | "30d" (Last 30 days) | "91d" (Last 91 days) | "month" (Since start of current month) | "6mo" (Last 6 months) | "12mo" (Last 12 months) | "year" (Since start of this year) | "all" (Since start of stats)',
          },
          {
            type: "array",
            items: {
              type: "string",
            },
            minItems: 2,
            maxItems: 2,
            description:
              'Custom date range as [start, end] in ISO8601 format. Examples: ["2024-01-01", "2024-07-01"] (date range) | ["2024-01-01T12:00:00+02:00", "2024-01-01T15:59:59+02:00"] (date-time range)',
          },
        ],
        description:
          "Date range for the query. Can be a predefined string or a custom array of two ISO8601 dates/timestamps",
      },
      dimensions: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "List of dimensions to group by. Event dimensions: 'event:goal', 'event:page', 'event:hostname'. Visit dimensions: 'visit:entry_page', 'visit:exit_page', 'visit:source', 'visit:referrer', 'visit:channel', 'visit:utm_medium', 'visit:utm_source', 'visit:utm_campaign', 'visit:utm_content', 'visit:utm_term', 'visit:device', 'visit:browser', 'visit:browser_version', 'visit:os', 'visit:os_version', 'visit:country', 'visit:region', 'visit:city', 'visit:country_name', 'visit:region_name', 'visit:city_name'. Time dimensions: 'time', 'time:hour', 'time:day', 'time:week', 'time:month'. Custom properties: 'event:props:<custom_prop_name>'",
      },
      filters: {
        type: "array",
        description:
          "Filters to limit which events or sessions are included. Each filter is an array with format [operator, dimension, clauses] or [operator, dimension, clauses, modifiers]. Operators: 'is', 'is_not', 'contains', 'contains_not', 'matches', 'matches_not'. Logical operators: 'and', 'or', 'not'. Behavioral filters: 'has_done', 'has_not_done'. Segments: ['is', 'segment', [<segment_id>]]. Example: ['is', 'visit:country_name', ['Germany', 'Poland']]",
      },
      order_by: {
        type: "array",
        items: {
          type: "array",
          minItems: 2,
          maxItems: 2,
        },
        description:
          "Custom ordering of query results. List of tuples [dimension_or_metric, direction] where direction is 'asc' or 'desc'. Example: [['visitors', 'desc'], ['visit:country_name', 'asc']]",
      },
      include: {
        type: "object",
        properties: {
          imports: {
            type: "boolean",
            description:
              "If true, tries to include imported data in the result. Default: false",
          },
          time_labels: {
            type: "boolean",
            description:
              "Requires a time dimension being set. If true, sets meta.time_labels in response containing all time labels valid for date_range. Default: false",
          },
          total_rows: {
            type: "boolean",
            description:
              "Should be used for pagination. If true, sets meta.total_rows in response containing the total number of rows for this query. Default: false",
          },
        },
        description:
          "Additional options for the query as to what data to include",
      },
      pagination: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of results to return. Default: 10000",
          },
          offset: {
            type: "number",
            description: "Number of results to skip. Default: 0",
          },
        },
        description: "Pagination options for the query",
      },
    },
  },
};
