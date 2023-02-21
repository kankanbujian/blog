
# from markdown import markdown
# import os

# # 遍历文件 (可按需修改)
# for root, dirs, files in os.walk("./"): # 在当前目录下遍历所有文件
#     # 不做任何操作
#     print(files)
#     pass

# # 逐个文件合并
# text = ""
# for item in files:
#     with open(item, "r") as f:
#         text += f.read() # 添加每一个文件的内容

# # 生成 HTML
# with open("output.html", "w+") as f:
#     f.write(markdown(text))

import os

# path = "md文档所在文件夹的绝对路径"

md_list = os.listdir()
print(md_list)
contents = []
for md in md_list:
    md_file = './' + md
    with open(md_file, 'r', encoding='utf-8') as file:
        contents.append(file.read() + "\n")

with open("xxx.md", "w", encoding='utf-8') as file:
    file.writelines(contents)