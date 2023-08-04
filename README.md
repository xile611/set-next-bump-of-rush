# Set next bump of rush

## useage

### examples

- Case 1: read nextBump

```
name: your workflow

on: push

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: read next_bump
        id: next_bump
        uses: xile611/set-next-bump-of-rush@main
        with:
          rush_path: './__tests__/test-rush'
          is_prelease: 'true'

      - name: Show markdown
        run: echo "Version is ${{ steps.next_bump.outputs.next_bump }}"
```

### inputs

| input name      | required | default value | description                       |
| --------------- | -------- | ------------- | --------------------------------- |
| release_version | false    |               | The version of release            |
| rush_path       | false    | './           | The root path of a rush project   |
| is_prerelease   | false    |               | set is prerelease version or not  |
| write_next_bump | false    |               | wether or not write the next bump |
| policy_name     | false    |               | the policy name to check          |

### outputs

| output name | type   | description          |
| ----------- | ------ | -------------------- |
| next_bump   | string | the next_bump parsed |

## develop

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  path: ''./
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:
