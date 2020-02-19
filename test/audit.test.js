import { test } from "tap";
import auditFunction from "../index";

test("", (subtest) => {

});

const runAudit = async () => {
    const audit = await auditFunction().setURLsFromSitemap("");



    audit.run();
};