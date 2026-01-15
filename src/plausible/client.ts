const PLAUSIBLE_API_URL =
  process.env.PLAUSIBLE_API_URL || "https://plausible.io/api/v2";
const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY;

if (!PLAUSIBLE_API_KEY) {
  throw new Error("PLAUSIBLE_API_KEY environment variable is required");
}

class PlausibleClient {
  async query(
    siteId: string,
    metrics: string[],
    dateRange: string | [string, string],
    dimensions?: string[],
    filters?: any[],
    orderBy?: [string, "asc" | "desc"][],
    include?: {
      imports?: boolean;
      time_labels?: boolean;
      total_rows?: boolean;
    },
    pagination?: {
      limit?: number;
      offset?: number;
    }
  ) {
    const body: any = {
      site_id: siteId,
      metrics: metrics,
      date_range: dateRange,
    };

    if (dimensions && dimensions.length > 0) {
      body.dimensions = dimensions;
    }

    if (filters && filters.length > 0) {
      body.filters = filters;
    }

    if (orderBy && orderBy.length > 0) {
      body.order_by = orderBy;
    }

    if (include) {
      body.include = include;
    }

    if (pagination) {
      body.pagination = pagination;
    }

    const response = await fetch(`${PLAUSIBLE_API_URL}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Plausible API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const plausibleClient = new PlausibleClient();
