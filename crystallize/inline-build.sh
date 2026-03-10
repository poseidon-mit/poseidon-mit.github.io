#!/bin/bash
CSS=$(cat dist/assets/index-Bbh-VyYB.css)
JS=$(cat dist/assets/index-wyqnS2nr.js)

cat > dist/crystallize-standalone.html << HTMLEOF
<!doctype html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Crystallize — Multi-LLM Orchestration</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
${CSS}
</style>
</head>
<body>
<div id="root"></div>
<script>
${JS}
</script>
</body>
</html>
HTMLEOF
echo "Done: dist/crystallize-standalone.html"
