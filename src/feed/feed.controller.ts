import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedPost } from './models/post.interface';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';


@Controller('feed')
export class FeedController {

    constructor(private FeedService: FeedService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() feedPost: FeedPost): Observable<FeedPost> {
        return this.FeedService.createPost(feedPost);
    }

    @Get()
    findAll(): Observable<FeedPost[]> {
        return this.FeedService.findAllPosts()
    }


    @Put(':id')
    update(@Body() feedPost: FeedPost, @Param('id') id: number): Observable<UpdateResult> {
        return this.FeedService.updatePost(id, feedPost)
    }


    @Delete(':id')
    delete(@Param('id') id: number): Observable<DeleteResult> {
        return this.FeedService.deletePost(id)
    }

    @Get(':id')
    getById(@Param('id') id: number): Observable<FeedPost> {
        return this.FeedService.getbyid(id)
    }

}
