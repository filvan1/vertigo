#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
layout(location=0)in vec3 a_position;
layout(location=1)in vec2 a_texCoord;

out vec2 texCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main(){
  
  gl_Position=projection*view*model*vec4(a_position,1.);
  texCoord=a_texCoord;
}
