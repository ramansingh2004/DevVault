interface APIError {
  response?: {
    data?: {
      detail?: string | Array<{ msg?: string }>;
      message?: string;
    };
  };
  message?: string;
}

export function getErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  const apiError = error as APIError | null | undefined;
  const detail = apiError?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail[0]?.msg || fallback;
  }

  return apiError?.response?.data?.message || apiError?.message || fallback;
}
