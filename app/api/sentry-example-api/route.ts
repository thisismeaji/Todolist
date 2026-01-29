import * as Sentry from "@sentry/nextjs";
export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// Non-throwing API route; errors are caught and reported without crashing.
export async function GET(request: Request) {
  Sentry.logger.info("Sentry example API called");
  try {
    const { searchParams } = new URL(request.url);
    const shouldFail = searchParams.get("simulateError") === "1";

    if (shouldFail) {
      throw new SentryExampleAPIError(
        "This error is raised on the backend called by the example page.",
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
