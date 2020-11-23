let lightBulbs = Array.from({ length: 1001 }, () => {
  return false;
});
for (let i = 1; i < lightBulbs.length; i++) {
  lightBulbs = lightBulbs.map((light, index) => {
    if (index % i === 0) return !light;
    return light;
  });
}

lightBulbs.forEach((light, index) => {
  if (light) console.log(`index: ${index}`);
});

console.log(lightBulbs.filter((light) => light).length);
console.log(Math.floor(Math.sqrt(1000000000)));
