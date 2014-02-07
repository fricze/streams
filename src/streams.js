requirejs.config({
    baseUrl: './src',
    paths: {
        react: '../bower_components/react/react',
        components: './components'
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