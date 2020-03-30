import { test } from "tap";
import deepAnchor from "../audits/deep-anchor";

const html = `<li>
<a href="/es/">
<i class="icon icon-home"></i>
<span>Inicio</span>
</a>
</li>
<li>
<a href="/es/preguntas-frecuentes">
<i class="icon icon-question-marks"></i>
<span>Preguntas Frecuentes</span>
</a>
<a href="mailto:migramcastillo@gmail.com">
Email
</a>
</li>`;

test("Deep anchor Tests", subtest => {
  subtest.test("Should look for anchors inside a html code", async t => {
    const matches = await deepAnchor(html);

    t.end();
  });

  subtest.end();
});
