export const getMLAlgDescription = (algorithm) =>{

    if(algorithm == "ResNet (Residual Neural Network)"){
        return "ResNet (Residual Network) is a deep learning algorithm in machine learning and computer vision. It's renowned for its ability to train very deep neural networks effectively, overcoming the challenges of vanishing gradients during training. ResNet introduces the concept of residual blocks, which contain shortcut connections that skip one or more layers.";
    } else if (algorithm == "BERT (Bidirectional Encoder Representations from Transformers)"){
        return "BERT, which stands for Bidirectional Encoder Representations from Transformers, is a natural language processing (NLP) model developed by Google in 2018. It represents a significant advancement in the field of NLP and has had a substantial impact on various NLP applications and tasks.";
    } else if (algorithm == "Random Forest"){
        return "Random Forest is a versatile machine learning algorithm used for both classification and regression tasks. It is an ensemble learning method that combines multiple decision trees to make predictions. Here are some key points about Random Forest";
    } else if (algorithm == "SVM"){
        return "Support Vector Machine (SVM) is a powerful machine learning algorithm used for classification and regression tasks. It works by finding the optimal hyperplane that best separates data points into different classes while maximizing the margin between the classes. SVM is known for its effectiveness in handling high-dimensional data and its ability to handle non-linear relationships through kernel functions.";
    } else if (algorithm == "Linear Regression"){
        return "Linear regression is a statistical technique used to model the relationship between variables by fitting a straight line to the data points. It's commonly used for prediction and understanding the association between variables."
    } else if (algorithm == "Logistic Regression"){
        return "Logistic regression is a statistical method used for binary classification tasks, where the outcome variable is categorical. It models the probability of the occurrence of a certain event by fitting a logistic function to the data. It's widely used in various fields for predicting outcomes such as whether a customer will buy a product or whether an email is spam."
    } else if (algorithm == "Decision Trees"){
        return "Decision Trees are a machine learning algorithm that creates a tree-like structure of decisions to classify or predict outcomes based on input features. They're easy to interpret and handle both numerical and categorical data.";
    } else if (algorithm == "Gradient Boosting Machine"){
        return "Gradient Boosting Machine is a powerful machine learning technique that builds predictive models by combining multiple weak learners, usually decision trees, in a sequential manner. It works by optimizing a loss function at each stage to minimize errors. Gradient Boosting Machines are known for their high predictive accuracy and ability to handle complex data patterns, making them widely used in various machine learning competitions and real-world applications."
    } else if (algorithm == "KNN"){
        return "KNN, or k-Nearest Neighbors, is a straightforward machine learning algorithm for classification and regression. It predicts based on the majority (for classification) or the average (for regression) of the 'k' nearest data points to a given input. It's non-parametric and doesn't require training, but performance depends on the distance metric and 'k' value chosen."
    } else if (algorithm == "DBSCAN"){
        return "DBSCAN, or Density-Based Spatial Clustering of Applications with Noise, is a popular clustering algorithm used in machine learning. It groups together data points that are closely packed, while marking outliers as noise. It's particularly useful for datasets with irregular shapes and varying densities. DBSCAN doesn't require specifying the number of clusters beforehand, making it robust and flexible for a wide range of clustering tasks."
    }
}