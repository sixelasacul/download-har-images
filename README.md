# download-har-images

Simple node script to save images from HAR files, copied from website.

> Note: doesn't work with Chrome HAR as it doesn't contain response content

```sh
# requires git and node (>=22.18.0)
git clone <project>
pnpm install

# Move your HAR file(s) in the `hars/` directory

pnpm download

# Should have everything in the `images/` directory

# Optional step, but requires `zip`
pnpm compress
```
