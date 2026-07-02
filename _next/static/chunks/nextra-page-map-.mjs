import meta from "../../../pages/_meta.js";
import archetypes_meta from "../../../pages/archetypes/_meta.js";
import examples_meta from "../../../pages/examples/_meta.js";
import references_meta from "../../../pages/references/_meta.js";
import skills_meta from "../../../pages/skills/_meta.js";
export const pageMap = [{
  data: meta
}, {
  name: "archetypes",
  route: "/archetypes",
  children: [{
    data: archetypes_meta
  }, {
    name: "adr",
    route: "/archetypes/adr",
    frontMatter: {
      "sidebarTitle": "Adr"
    }
  }, {
    name: "generate-spec",
    route: "/archetypes/generate-spec",
    frontMatter: {
      "sidebarTitle": "Generate Spec"
    }
  }, {
    name: "orchestrator-workers",
    route: "/archetypes/orchestrator-workers",
    frontMatter: {
      "sidebarTitle": "Orchestrator Workers"
    }
  }, {
    name: "plan-execute",
    route: "/archetypes/plan-execute",
    frontMatter: {
      "sidebarTitle": "Plan Execute"
    }
  }, {
    name: "self-healing",
    route: "/archetypes/self-healing",
    frontMatter: {
      "sidebarTitle": "Self Healing"
    }
  }]
}, {
  name: "examples",
  route: "/examples",
  children: [{
    data: examples_meta
  }, {
    name: "loop-config",
    route: "/examples/loop-config",
    frontMatter: {
      "sidebarTitle": "Loop Config"
    }
  }, {
    name: "mcp-integrations",
    route: "/examples/mcp-integrations",
    frontMatter: {
      "sidebarTitle": "Mcp Integrations"
    }
  }, {
    name: "run-report",
    route: "/examples/run-report",
    frontMatter: {
      "sidebarTitle": "Run Report"
    }
  }, {
    name: "tickets-per-archetype",
    route: "/examples/tickets-per-archetype",
    frontMatter: {
      "sidebarTitle": "Tickets per Archetype"
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "sidebarTitle": "Index"
  }
}, {
  name: "quickstart",
  route: "/quickstart",
  frontMatter: {
    "sidebarTitle": "Quickstart"
  }
}, {
  name: "references",
  route: "/references",
  children: [{
    data: references_meta
  }, {
    name: "anti-patterns",
    route: "/references/anti-patterns",
    frontMatter: {
      "sidebarTitle": "Anti Patterns"
    }
  }, {
    name: "autonomy-config",
    route: "/references/autonomy-config",
    frontMatter: {
      "sidebarTitle": "Autonomy Config"
    }
  }, {
    name: "git-flow",
    route: "/references/git-flow",
    frontMatter: {
      "sidebarTitle": "Git Flow"
    }
  }, {
    name: "manifest-types",
    route: "/references/manifest-types",
    frontMatter: {
      "sidebarTitle": "Manifest Types"
    }
  }, {
    name: "maturity-model",
    route: "/references/maturity-model",
    frontMatter: {
      "sidebarTitle": "Maturity Model"
    }
  }, {
    name: "mcp-integrations",
    route: "/references/mcp-integrations",
    frontMatter: {
      "sidebarTitle": "Mcp Integrations"
    }
  }, {
    name: "state-spine",
    route: "/references/state-spine",
    frontMatter: {
      "sidebarTitle": "State Spine"
    }
  }, {
    name: "universal-commands",
    route: "/references/universal-commands",
    frontMatter: {
      "sidebarTitle": "Universal Commands"
    }
  }]
}, {
  name: "skills",
  route: "/skills",
  children: [{
    data: skills_meta
  }, {
    name: "do",
    route: "/skills/do",
    frontMatter: {
      "sidebarTitle": "Do"
    }
  }, {
    name: "loop-adr",
    route: "/skills/loop-adr",
    frontMatter: {
      "sidebarTitle": "Loop Adr"
    }
  }, {
    name: "loop-generate-spec",
    route: "/skills/loop-generate-spec",
    frontMatter: {
      "sidebarTitle": "Loop Generate Spec"
    }
  }, {
    name: "loop-orchestrator",
    route: "/skills/loop-orchestrator",
    frontMatter: {
      "sidebarTitle": "Loop Orchestrator"
    }
  }, {
    name: "loop-plan-execute",
    route: "/skills/loop-plan-execute",
    frontMatter: {
      "sidebarTitle": "Loop Plan Execute"
    }
  }, {
    name: "loop-self-healing",
    route: "/skills/loop-self-healing",
    frontMatter: {
      "sidebarTitle": "Loop Self Healing"
    }
  }]
}];