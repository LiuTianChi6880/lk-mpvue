// baseUrl
export let baseUrl = 'https://lk-xchx-food-api-qa.op.laikang.com'// dev环境
if (process.env.NODE_ENV === 'qualityAssurance') {
  baseUrl = 'https://lk-xchx-food-api-qa.op.laikang.com' // qa环境
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://lk-xchx-food-suggest-api-pro.op.laikang.com' // pro环境
}
// 根据菜谱联想所有名字
export const getCookLikeName = '/api/v1/CookDetail/getCookbookLikeName'
