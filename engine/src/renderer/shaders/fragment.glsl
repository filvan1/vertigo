#version 300 es
 
precision highp float;

out vec4 FragColor;

in vec3 color;
in vec2 texCoord;

uniform sampler2D u_texture;


void main() {
  //Look up colour from texture
  FragColor=texture(u_texture, texCoord);
}
