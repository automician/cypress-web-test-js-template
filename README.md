## Conventions

* Use arrow functions over functions for mocha's describes and its to dissalow access and so cut the less consistent "this" style access to cypress aliases;). This will make tests more consistent and so more readable. Also it will be easier to debug them, and reduce errors connected to sync/async flow break.