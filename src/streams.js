requirejs.config({
    baseUrl: './src',
    paths: {
        react: '../bower_components/react/react',
        store: '../bower_components/store.js/store',
        components: './components',
    }
});

require(["react", "components"], function (React, components) {

  /**
   * Renders main application component
   */
  React.renderComponent(
    components.Stream({}),
    document.getElementById("app")
  );

});