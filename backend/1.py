def data_pipeline():
    data = yield "请输入原始数据："  # 步骤1：接收数据
    data = data.strip()  # 清洗1：去空格
    data = yield f"清洗后：{data}，请确认："  # 步骤2：返回清洗结果
    if data.lower() == "yes":
        yield "处理完成！"
    else:
        yield "已取消"

# 创建生成器对象
pipeline = data_pipeline()

# 启动生成器，获取第一个提示（第一次必须用next()，不能直接send()）
prompt1 = next(pipeline)
print(prompt1)  # 输出：请输入原始数据：

# 发送原始数据（比如"  hello  "），获取清洗后的提示
prompt2 = pipeline.send("  hello  ")
print(prompt2)  # 输出：清洗后：hello，请确认：

# 发送确认信息（比如"yes"），获取最终结果
result = pipeline.send("yes")
print(result)  # 输出：处理完成！