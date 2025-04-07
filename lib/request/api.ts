type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions {
  path: string;
  method?: HttpMethod;
  body?: Record<string, any> | FormData; // Soporta JSON y FormData (para archivos)
  headers?: Record<string, string>;
}

// Función base para todas las peticiones HTTP
async function request<T>(options: ApiRequestOptions): Promise<T> {
  const { path, method = 'GET', body, headers = {} } = options;

  // Configuración de los headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const finalHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  // Configuración del cuerpo (body)
  let finalBody: BodyInit | null = null;
  if (body) {
    if (body instanceof FormData) {
      finalBody = body;
      // Elimina 'Content-Type' para que el navegador lo ajuste automáticamente con el FormData
      delete finalHeaders['Content-Type'];
    } else {
      finalBody = JSON.stringify(body);
    }
  }

  // Hacemos la petición
  const response = await fetch(path, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  // Si la respuesta no es exitosa, lanzamos un error
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }

  // Retornamos los datos parseados (asumiendo que siempre es JSON)
  return response.json() as Promise<T>;
}

// Métodos específicos (GET, POST, etc.) para simplificar el uso
export const get = <T>(options: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> => {
  return request<T>({ ...options, method: 'GET' });
};

export const post = <T>(options: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
  return request<T>({ ...options, method: 'POST' });
};

export const put = <T>(options: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
  return request<T>({ ...options, method: 'PUT' });
};

export const del = <T>(options: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
  return request<T>({ ...options, method: 'DELETE' });
};