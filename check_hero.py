import re

p = r'D:\Firefox\NEW\invite\public\demos\demo-3\assets\index-YMWjVkqv.js'
with open(p, 'r') as f:
    js = f.read()

# Find all hero-related class names
matches = re.findall(r'className="([a-zA-Z0-9_-]*hero[a-zA-Z0-9_-]*)"', js)
print("Hero-related class names:")
for m in sorted(set(matches)):
    print(f"  {m}")

# Find the section/div that contains the hero elements
# Look for the container that has all the hero-* children
print(f"\nTotal occurrences of 'hero': {len(re.findall(r'hero', js))}")

# Search for the section wrapper around the hero content
# Look for patterns like s.jsx("section" or s.jsx("div" with hero classes
section_pattern = re.findall(r's\.jsx\("(section|div)",\{className:"([^"]*hero[^"]*)"', js)
print(f"\nSection/div with hero class:")
for s, c in section_pattern[:10]:
    print(f"  <{s} className=\"{c}\">")
