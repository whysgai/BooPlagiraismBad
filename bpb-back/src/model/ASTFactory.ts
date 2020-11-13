export interface IASTFactory {
    //buildAST(jsonFile : JSON)
}

export class ASTFactory implements IASTFactory {
    buildAST(jsonFile: JSON) {
        throw new Error("Method not implemented.");
    }
}