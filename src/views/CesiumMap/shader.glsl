czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
 material.diffuse = vec3(0.0, 0.0, 1.0);
 material.alpha = 0.5;
return material;
}
