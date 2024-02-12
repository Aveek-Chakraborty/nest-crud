import { Injectable } from '@nestjs/common';
import { FeedPostEntity } from './models/post.entity';
import { DeleteResult, Repository, UpdateResult, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from './models/post.interface';
import { Observable, from } from 'rxjs';

@Injectable()
export class FeedService {

    constructor(@InjectRepository(FeedPostEntity) private feedPostRepository: Repository<FeedPostEntity>) { }

    createPost(feedpost: FeedPost): Observable<FeedPost> {
        return from(this.feedPostRepository.save(feedpost))
    }

    findAllPosts(): Observable<FeedPost[]> {
        return from(this.feedPostRepository.find())
    }

    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        return from(this.feedPostRepository.update(id, feedPost))
    }

    deletePost(id: number): Observable<DeleteResult> {
        return from(this.feedPostRepository.delete(id));
    }

    getbyid(id: number): Observable<FeedPost> {
        const options: FindOneOptions<FeedPostEntity> = {
            where: {
                id: id
            }
        };
        return from(this.feedPostRepository.findOne(options));
    }

}

