# CIIPro: a new read-across portal to fill data gaps using public large-scale chemical and biological data #

[CIIPro](ciipro.rutgers.edu) is a website written in Python using the microframework [Flask](http://flask.pocoo.org/). CIIPro seeks to be a 
chemical analysis tool by allowing users to extract biological data associated with chemicals, find _in vitro_-_in vivo_
correlations, and use biological and chemical features to make assessments on a variety of chemical endpoints.  

The CIIPro website was created and is maintained by [Daniel P. Russo](www.danielprusso) ([@russodanielp](https://twitter.com/russodanielp))
within the [Zhu Research Group](https://zhu.camden.rutgers.edu/) at [Rutgers University](camden.rutgers.edu).

Contributing to CIIPro is welcomed as well as feedback for new features.  More information on contributing or 
feature suggestions can be found below.  Questions are encouraged and can be addressed to danrusso@scarletmail.rutger.edu.

### Feature Request ###

To request a feature or report a bug, please use [Issue Tracker](https://github.com/russodanielp/ciipro/issues).



### Contributing ###

If you are interested in contributing to CIIPro you can clone the repository and configure the Flask app to your local machine.  
Contributions are welcome in the form of pull requests.  Package and dependency management is done through [conda](https://anaconda.org/).
After installing conda the CIIPro virtual environment can be created using the `environment.yml` file.  In the 
 `environment.yml` file directory use the command:
 ```
 conda env create --force
 ```

