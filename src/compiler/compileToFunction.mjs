import parse from "./parse.mjs"
import generate from "./generate.mjs"

export default function compileToFunction(template) {
  // 将模板编译成 ast
  const ast = parse(template)
  console.log(ast)
  // 从 ast 生成渲染函数
  const render = generate(ast)
  return render
}