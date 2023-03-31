uniform vec4 u_diffuse;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material=czm_getDefaultMaterial(materialInput);
    material.diffuse=u_diffuse.xyz;
    material.alpha=u_diffuse[3];
    return material;
}
