export function initVertexBuffer(
  gl: WebGLRenderingContext,
  data: Float32Array,
  size: number,
  pointer: number
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  if (!buffer) return null

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(pointer, size, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(pointer)

  return buffer
}
