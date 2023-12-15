export const baseURLForDev = "http://localhost:8080";
export const baseURLForProd = "http://www.kariyernet.com";

export const registerEndpoint = "/user/register";
export const loginEndpoint = "/user/login";
export const loginVerifyEndpoint = "/user/login/verify";
export const getMyProfileEndPoint = "/user/my/profile";
export const getProfileByUsernameEndPoint = "/user/profile";
export const updateUserEndpoint = "/user/update";
export const resetPasswordEndpoint = "/user/reset/password";
export const verifyResetPasswordEndpoint = "/user/reset/password/verify";
export const getUsersEndpoint = "/user";
export const deleteUserEndpoint = "/user/delete";

export const getCategoriesEndpoint = "/category/get";

export const getMoviesByCategoryIdEndpoint = "/movie/get/category";
export const getLatestMoviesEndpoint = "/movie/get/latest";
export const getTopRatedMoviesEndpoint = "/movie/get/top-rated";
export const getMostCommentedMoviesEndpoint = "/movie/get/most-commented";
export const getSearchMoviesEndpoint = "/movie/get/search";
export const getMovieById = "/movie/get";
export const postComment = "/movie/comment/add";
export const deleteComment = "/movie/comment/delete";
export const postLikeMovie = "/movie/like";
export const deleteMovie = "/movie/delete";

export const getTalentsEndpoint = "/actor/get";
export const getTalentsByIdEndpoint = "/actor/get/detail";
export const deleteTalentEndpoint = "/actor/delete";

export const getProdUrl = (url: string) => baseURLForProd + url;

export const getDevUrl = (url: string) => baseURLForDev + url;
