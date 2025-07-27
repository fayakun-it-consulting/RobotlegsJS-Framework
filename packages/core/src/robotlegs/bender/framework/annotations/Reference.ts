import "reflect-metadata";

function Reference() {
    return function (target: any) {
        Reflect.defineMetadata("reference", true, target);
    };
}
