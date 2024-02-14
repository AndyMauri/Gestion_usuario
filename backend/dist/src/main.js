"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function configureCors(app) {
    app.enableCors();
}
async function startApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await configureCors(app);
    await app.listen(3000);
}
startApp();
//# sourceMappingURL=main.js.map