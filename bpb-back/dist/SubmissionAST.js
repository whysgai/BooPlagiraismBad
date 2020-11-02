"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionASTLeaf = exports.SubmissionASTNode = void 0;
var SubmissionASTNode = /** @class */ (function () {
    function SubmissionASTNode() {
    }
    SubmissionASTNode.prototype.compare = function (otherSubmissionAST) {
        throw new Error('Method not implemented.');
    };
    SubmissionASTNode.prototype.add = function (submissionAST) {
        throw new Error('Method not implemented.');
    };
    SubmissionASTNode.prototype.remove = function (submissionAST) {
        throw new Error('Method not implemented.');
    };
    SubmissionASTNode.prototype.getChild = function (submissionAST) {
        throw new Error('Method not implemented.');
    };
    SubmissionASTNode.prototype.getValue = function () {
        throw new Error('Method not implemented.');
    };
    return SubmissionASTNode;
}());
exports.SubmissionASTNode = SubmissionASTNode;
var SubmissionASTLeaf = /** @class */ (function () {
    function SubmissionASTLeaf() {
    }
    SubmissionASTLeaf.prototype.compare = function (otherSubmissionAST) {
        throw new Error('Method not implemented.');
    };
    SubmissionASTLeaf.prototype.getValue = function () {
        throw new Error('Method not implemented.');
    };
    //Unsupported operations
    SubmissionASTLeaf.prototype.add = function (submissionAST) {
        throw new Error('Method not Supported.');
    };
    SubmissionASTLeaf.prototype.remove = function (submissionAST) {
        throw new Error('Method not Supported.');
    };
    SubmissionASTLeaf.prototype.getChild = function (submissionAST) {
        throw new Error('Method not Supported.');
    };
    return SubmissionASTLeaf;
}());
exports.SubmissionASTLeaf = SubmissionASTLeaf;
