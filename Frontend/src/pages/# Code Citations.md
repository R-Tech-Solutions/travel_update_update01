# Code Citations

## License: unknown
https://github.com/NAUSlCAA/3djs/tree/7cde52712defa73ade37f4ba5cab1e710939dfc4/test.htm

```
this.views.length; ++ii) {
            var view = this.views[ii];
            var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
            camera.position.fromArray([0, 0,
```


## License: unknown
https://github.com/Swarngaurav/owner/tree/ee12109518f9dfdbf057c8cebd2c2deba5b08117/sites.js

```
THREE.Scene();

          for (var ii = 0; ii < this.views.length; ++ii) {
            var view = this.views[ii];
            var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1
```


## License: unknown
https://github.com/KasimDogruyol/airplane-animated-website/tree/15a5406bf3b789ccb90ad2f2a6748062ffd24630/script.js

```
window.addEventListener('resize', this.onResize, false);

          var edges = new THREE.EdgesGeometry(model.children[0].geometry);
          let line = new THREE.LineSegments(edges);
          line.material.depthTest = false;
          line.material
```


## License: unknown
https://github.com/Parisotto/aviao/tree/a28bb52546872484b4ff1719fc2b9ccf367ddf04/script.js

```
);
          let line = new THREE.LineSegments(edges);
          line.material.depthTest = false;
          line.material.opacity = 0.5;
          line.material.transparent = true;
          line.position.x = 0.5;
          line.position.z =
```


## License: unknown
https://github.com/a21mj0n/portfolio-a21mj0n/tree/2ce5bc49720372dea8c74c007d5b6d5b8d72da5c/src/assets/js/main.js

```
screen.width - (this.w * 1)) / 3;
            camera.position.z = camZ < 180 ? 180 : camZ;
            camera.updateProjectionMatrix();
          }

          this.renderer.setSize(this.w, this.h);
          this.render(
```

