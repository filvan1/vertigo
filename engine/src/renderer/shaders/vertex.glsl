#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
layout(location=0) in vec3 a_position;
layout(location=1) in vec3 a_color;
layout(location=2) in vec2 a_texCoord;

out vec3 color;
out vec2 texCoord;


void main() {

  gl_Position = vec4(a_position,1.0);
  color=a_color;
  texCoord=a_texCoord;
}
