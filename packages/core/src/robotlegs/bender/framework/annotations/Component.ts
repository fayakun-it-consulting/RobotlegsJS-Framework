import "reflect-metadata";

function Component() {
    return function (target: any) {
        Reflect.defineMetadata("component", true, target);
    };
}
