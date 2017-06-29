import packageGet from '../../src/routes/package-get';

export default class {
    constructor() {
        this.route = new packageGet(
            new class {
                getPackage() {
                    return "--packagedata--";
                }
            },
            new class {

            }
        );
    }

    test() {
        console.log(this.request);
    }
}