import api from './api'

const layoutService = {
  getByCategory: (categoryId) => api.get(`/layouts/${categoryId}`),
  save: (data) => api.post('/layouts', data),
  update: (id, data) => api.put(`/layouts/${id}`, data),
  remove: (id) => api.delete(`/layouts/${id}`),
}

export default layoutService
