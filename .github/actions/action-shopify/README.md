# Deploy Shopify theme for GitHub Actions

This GitHub action is derivative from : https://github.com/pgrimaud/actions.

## Usage

To use the action simply add the following lines to your workflow .yml file.

```yaml
...
  steps:
      - uses: actions/checkout@v1
      - name: Shopify
        uses: pgrimaud/action-shopify@master
        env:
          SHOPIFY_PASSWORD: ${{ secrets.SHOPIFY_PASSWORD }}
          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}
          SHOPIFY_ENV_LABEL: ${{ secrets.SHOPIFY_ENV_LABEL }}
          THEME_PATH: ${{ secrets.THEME_PATH }}
```

You can see a repository with this action here : https://github.com/pgrimaud/shopify-debut

### Required Secrets

First you have to generate a private app to get an API KEY on Shopify. [Get API Access](https://shopify.github.io/themekit/#get-api-access).

Then you'll need to provide some secrets to use the action.

* **SHOPIFY_PASSWORD**: Your password from your private app previously created.
* **SHOPIFY_STORE_URL**: Your store url. (e.g. `demo.myshopify.com`).
* **SHOPIFY_ENV_LABEL**: Your theme id on your Shopify Store.
* **THEME_PATH**: Path of your theme on your GitHub repository. If your theme is at the root of your repository, just use `./`.

### Optional Arguments

The optional argument you can add to improve theme deployment. Optional args are available on [Theme Kit help](https://shopify.github.io/themekit/configuration/#flags).

#### Examples

```yaml
...
  steps:
      - uses: actions/checkout@v1
      - name: Shopify
        uses: pgrimaud/action-shopify@master
        env:
          SHOPIFY_PASSWORD: ${{ secrets.SHOPIFY_PASSWORD }}
          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}
          SHOPIFY_ENV_LABEL: ${{ secrets.SHOPIFY_ENV_LABEL }}
          THEME_PATH: ${{ secrets.THEME_PATH }}
        with:
          args: --ignored-file=sections/*
```

Your can also combine multiple arguments : 

```yaml
...
  steps:
      - uses: actions/checkout@v1
      - name: Shopify
        uses: pgrimaud/action-shopify@master
        env:
          SHOPIFY_PASSWORD: ${{ secrets.SHOPIFY_PASSWORD }}
          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}
          SHOPIFY_ENV_LABEL: ${{ secrets.SHOPIFY_ENV_LABEL }}
          THEME_PATH: ${{ secrets.THEME_PATH }}
        with:
          args: --ignored-file=sections/* --timeout=30
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
