/**
 * 简单实现data的读写监听
 */

const handler = {
  get (target, prop, receiver) {
    console.log(`get property ${prop}`)
    return Reflect.get(target, prop, receiver);
  },

  set (target, prop, value) {
    console.log(`set property ${prop}: ${value}`)
    return Reflect.set(target, prop, value);
  }
}

// export default obj => {
//   return new Proxy(obj, handler)
// }
module.exports = obj => {
  return new Proxy(obj, handler)
}