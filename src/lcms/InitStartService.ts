export interface InitStartService {
    init: () => Promise<boolean>;
    start: () => any;
}