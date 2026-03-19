import{_ as c,C as n,c as o,o as t,a2 as p,G as l,b as E,w as e,j as s,a as i,a7 as b}from"./chunks/framework.CoW5xFSj.js";const f=JSON.parse('{"title":"让 AI 成为你的专家助手：Claude Skills 完全指南","description":"深入解析 Anthropic Claude Skills 技术原理,了解如何通过可复用的技能包让 Claude 成为你的专业助手。涵盖 Skills 与 MCP 协议的关系、渐进式加载机制、技能编排等核心技术。","frontmatter":{"layout":"doc","title":"让 AI 成为你的专家助手：Claude Skills 完全指南","category":"人工智能","tags":["AI","Claude","Skills","MCP","Anthropic","智能体"],"description":"深入解析 Anthropic Claude Skills 技术原理,了解如何通过可复用的技能包让 Claude 成为你的专业助手。涵盖 Skills 与 MCP 协议的关系、渐进式加载机制、技能编排等核心技术。","author":"smallyoung","date":"2025-12-21T00:00:00.000Z","dateModified":"2025-12-21T00:00:00.000Z","keywords":["Claude Skills","Anthropic","MCP","Model Context Protocol","AI技能","智能体","工作流自动化","Progressive Disclosure"],"cover":"//pub.smallyoung.cn/cdn-cgi/image/quality=60/course_slidev/skills/1.png"},"headers":[],"relativePath":"docs/Claude skills.md","filePath":"docs/Claude skills.md","lastUpdated":null}'),g={name:"docs/Claude skills.md"};function u(y,a,m,F,C,A){const h=n("AudioPlayer"),r=n("VideoPlayer"),k=n("MindMapFloat"),d=n("Mermaid");return t(),o("div",null,[a[2]||(a[2]=p("",11)),l(h,{src:"//pub.smallyoung.cn/course_slidev/skills/Claude_Skills：AI如何从助手进化成专家团队.m4a",author:"SmallYoung"}),l(r,{src:"//pub.smallyoung.cn/course_slidev/skills/从助手到专家：Claude_Skills_完全指南.mp4"}),l(k,{title:"让 AI 成为你的专家助手：Claude Skills 完全指南"},{default:e(()=>[...a[0]||(a[0]=[s("div",{class:"language-mindmap-data vp-adaptive-theme line-numbers-mode"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mindmap-data"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[s("code",null,[s("span",{class:"line"},[s("span",null,"# Claude Skills 完全指南")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 基本概念")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 定义: 可复用任务能力包系统")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 核心文件: SKILL.md")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 设计理念: Progressive Disclosure (渐进式加载)")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 核心特性")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 智能加载: 初始仅加载元数据，按需加载全文")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 程序化知识: 提供详细执行步骤与最佳实践")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 技能编排: 自动选择、组合多个技能完成复杂任务")]),i(`
`),s("span",{class:"line"},[s("span",null,"- Token 高效: 动态占用上下文空间")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 与 MCP 的关系")]),i(`
`),s("span",{class:"line"},[s("span",null,"- MCP: 提供连接能力 (访问外部系统)")]),i(`
`),s("span",{class:"line"},[s("span",null,"- Skills: 提供执行能力 (如何专业地使用系统)")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 协作: MCP 获取数据，Skills 处理流程")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 技能生命周期")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 创建: 编写 SKILL.md 和脚本")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 注册: 上传至 Claude UI 或 API")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 待命: 预加载名称和描述")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 激活: 根据用户需求调用工具")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 执行: 按照定义步骤操作")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 应用场景")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 企业知识管理: 文档转培训指南")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 代码审查助手: 标准化反馈格式")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 客户支持自动化: 分类、查找并生成回复")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 快速上手")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 订阅要求: Pro, Max, Team, Enterprise")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 操作步骤: 创建目录 -> 编写 SKILL.md -> 上传激活")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 使用方式: 网页界面、API、Claude Code")]),i(`
`),s("span",{class:"line"},[s("span",null,"## 最佳实践")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 原则: 明确性、可测试性、模块化")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 调试: 检查元数据、简化测试、查看反馈")]),i(`
`),s("span",{class:"line"},[s("span",null,"- 避免错误: 功能过宽、缺少示例、步骤模糊")])])]),s("div",{class:"line-numbers-wrapper","aria-hidden":"true"},[s("span",{class:"line-number"},"1"),s("br"),s("span",{class:"line-number"},"2"),s("br"),s("span",{class:"line-number"},"3"),s("br"),s("span",{class:"line-number"},"4"),s("br"),s("span",{class:"line-number"},"5"),s("br"),s("span",{class:"line-number"},"6"),s("br"),s("span",{class:"line-number"},"7"),s("br"),s("span",{class:"line-number"},"8"),s("br"),s("span",{class:"line-number"},"9"),s("br"),s("span",{class:"line-number"},"10"),s("br"),s("span",{class:"line-number"},"11"),s("br"),s("span",{class:"line-number"},"12"),s("br"),s("span",{class:"line-number"},"13"),s("br"),s("span",{class:"line-number"},"14"),s("br"),s("span",{class:"line-number"},"15"),s("br"),s("span",{class:"line-number"},"16"),s("br"),s("span",{class:"line-number"},"17"),s("br"),s("span",{class:"line-number"},"18"),s("br"),s("span",{class:"line-number"},"19"),s("br"),s("span",{class:"line-number"},"20"),s("br"),s("span",{class:"line-number"},"21"),s("br"),s("span",{class:"line-number"},"22"),s("br"),s("span",{class:"line-number"},"23"),s("br"),s("span",{class:"line-number"},"24"),s("br"),s("span",{class:"line-number"},"25"),s("br"),s("span",{class:"line-number"},"26"),s("br"),s("span",{class:"line-number"},"27"),s("br"),s("span",{class:"line-number"},"28"),s("br"),s("span",{class:"line-number"},"29"),s("br"),s("span",{class:"line-number"},"30"),s("br"),s("span",{class:"line-number"},"31"),s("br"),s("span",{class:"line-number"},"32"),s("br")])],-1)])]),_:1}),a[3]||(a[3]=p("",101)),(t(),E(b,null,{default:e(()=>[l(d,{id:"mermaid-851",class:"mermaid-diagram",graph:"graph%20LR%0A%20%20%20%20A%5B%E7%94%A8%E6%88%B7%E4%B8%8A%E4%BC%A0%20CSV%5D%20--%3E%20B%5B%E6%95%B0%E6%8D%AE%E6%B8%85%E6%B4%97%E5%99%A8%5D%0A%20%20%20%20B%20--%3E%20C%5B%E7%BB%9F%E8%AE%A1%E5%88%86%E6%9E%90%E5%99%A8%5D%0A%20%20%20%20C%20--%3E%20D%5B%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8%5D%0A%20%20%20%20D%20--%3E%20E%5B%E8%BE%93%E5%87%BA%E6%8A%A5%E5%91%8A%5D%0A"})]),fallback:e(()=>[...a[1]||(a[1]=[i(" Loading... ",-1)])]),_:1})),a[4]||(a[4]=p("",103))])}const v=c(g,[["render",u]]);export{f as __pageData,v as default};
