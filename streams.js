requirejs.config({
    baseUrl: './',
    paths: {
        react: './bower_components/react/react',
        components: './src/components',
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