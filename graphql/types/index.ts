export * from './Link'
export * from './User'


//when theres a lot of links in a page, page will take long time to load
//this is cuz theres a large api response, results in slow user experience
//to solve this, we can use pagination
//pagination split data into pages, and send these pages only when they are requested


//cursor-based pagination has 2 arguments
//1st argu(initial request): "first: (a number)", this is the amt of items u wan the api to return
//2nd argu(2nd request): the return data contains a cursor in each item, pass the cursor of the last item to the 2nd request 
//hence, at dbs lvl u can jump str8 to whr u wan n not include the prev results