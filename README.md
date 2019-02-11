# ⚠️ [WIP] See the todo list below
# Use as shown in the [demo project](https://github.com/wave909/ignite-bowser-ext)
Submodule with common logic, desgined for rapid development and integration of shared components.

When used in private settings, it is advised to name submodule branches with the project names/issue tracker prefixes.

Example:
```
$ git branch -r
  origin/ECOMM
  origin/CHAT
  origin/some-specific-project
```

Internal wikis (such as Confluence) will then serve as a reference for developers to understand the meaning behind new code.
This allows for better discerning of project-specific vs. commonplace solutions. 

⚠️ Don't forget to pull the dependency after checking out this project!

```git submodule update --init```

# TODO
- [ ] Enforce dependencies (mobx, mobx-state-tree, etc.)
- [ ] Rework the project structure to share unit-tests for the components
- [ ] Describe the workflow to publish battle-tested components as libraries
