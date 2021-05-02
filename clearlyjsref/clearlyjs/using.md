---
description: Imports a clearlyJs tool
---

# using

{% hint style="danger" %}
LABS - may not work as expected
{% endhint %}

using is the function for importing ClearlyJS add-ins.

## Parameters

* **toolName:** Name of the tool to import, for example: "debug" or "fast"

## Returns

HTML element of the tool's file

## Possible tool names

* **debug**: ClearlyDebug - a debugger for ClearlyJS
* **Fast**: ClearlyFast - a tool that makes images load faster without losing quality

## Examples

```jsx
clrly.using("debug")
```

