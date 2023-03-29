attribute vec4 a_Position;
uniform mat4 u_Matrix4;

void main() {
    gl_Position = u_Matrix4 * a_Position;
}
