import request from '@/utils/request'

export function getWaferMapData() {
  return request({
    url: '/api/wafer/map-data',
    method: 'get'
  })
}