export interface IRoute {
    get(uri : String, data : String) : Response;
    post(uri : String, data : String) : Response;
}

export class GetAssignmentsRoute implements IRoute {
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
}

export class PostAssignmentRoute implements IRoute{
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
}

export class PostSubmissionRoute implements IRoute {
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
}

export class CompareSubmissionRoute implements IRoute {
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }

}

export class GetSubmissionRoute implements IRoute {
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }

}

export class UploadSubmissionFileRoute implements IRoute {
    get(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
    post(uri: String, data: String): Response {
        throw new Error("Method not implemented.");
    }
}
