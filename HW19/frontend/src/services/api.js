const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
};

export const getAllDestinations = async () => {
    const response = await fetch(`${API_URL}/destinations`);
    return handleResponse(response);
};

export const getDestinationById = async (id) => {
    const response = await fetch(`${API_URL}/destinations/${id}`);
    return handleResponse(response);
};

export const createDestination = async (destinationData) => {
    const response = await fetch(`${API_URL}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationData),
    });
    return handleResponse(response);
};

export const updateDestination = async (id, destinationData) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationData),
    });
    return handleResponse(response);
};

export const deleteDestination = async (id) => {
    const response = await fetch(`${API_URL}/destinations/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};

export const getDestinationsByCountry = async (country) => {
    const response = await fetch(`${API_URL}/destinations/country/${encodeURIComponent(country)}`);
    return handleResponse(response);
};

export const getCountries = async () => {
    const response = await fetch(`${API_URL}/destinations/countries`);
    return handleResponse(response);
};
