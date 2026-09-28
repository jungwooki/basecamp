# coding: utf-8
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json
BASE=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.refs=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('href','src','poster') and v:self.refs.append(v)
errors=[];checked=0
for p in BASE.rglob('*'):
 if '.git' in p.parts or p.suffix not in ('.html','.css'):continue
 text=p.read_text(errors='replace');refs=[]
 if p.suffix=='.html':
  h=Parser();h.feed(text);refs=h.refs
 refs+=re.findall(r'url\([\s\"\']*([^\s)\"\']+)',text)
 for ref in refs:
  if ref.startswith(('data:','http:','https:','//','blob:','#','mailto:','tel:','about:')) or '${' in ref:continue
  u=urlsplit(ref)
  if not u.path:continue
  target=(BASE/u.path.lstrip('/') if u.path.startswith('/') else p.parent/unquote(u.path)).resolve();checked+=1
  if not target.is_relative_to(BASE) or not target.exists():errors.append([str(p.relative_to(BASE)),ref])
print(json.dumps({'checked':checked,'errors':errors},ensure_ascii=False,indent=2));raise SystemExit(bool(errors))
