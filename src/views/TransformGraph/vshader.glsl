attribute vec4 a_Position;
uniform vec4 u_Translate;

void main() {
    gl_Position = a_Position + u_Translate;
}
