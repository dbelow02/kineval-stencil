#include "Fetch_Controller.hpp"

Fetch_Controller::Fetch_Controller(ros::NodeHandle &nh)
{
    nh_ = nh;
    subscriber_ = nh_.subscribe("/base_scan", 1000, &Fetch_Controller::Laser_Scan_Callback, this);
    publisher_ = nh_.advertise<geometry_msgs::Twist>("/cmd_vel", 1000);

    //TODO: initialize a subscriber that is set to the channel "/base_scan". Set its callback function to be Laser_Scan_Callback
    //TODO: initialize a publisher that is set to the channel "/cmd_vel"


}

void Fetch_Controller::Laser_Scan_Callback(const sensor_msgs::LaserScan::ConstPtr &msg_laser_scan)
{
    /*TODO: 
    Given the incoming laser scan message, find the minimium distance of the front facing scans
    Hint: The laser scan measuring directly in front of the robot will be the scan at the middle of the array laser scans. 
    So for finding the minimum, we will ONLY consider the 120 laser scans in the middle of the array of laser scans. 
    If the minimum scan in this direction is greater than 1m, drive forward. 
    Otherwise, turn left. 
    */
    //std::double range = msg_laser_scan.angle_max - msg_laser_scan.angle_min;
    //662 elts if this method doesnt work.
    //std::double size = range / msg_laser_scan.angle_increment;
    std::double size = 662;
    std::double min = 50;
    for(std::int i = (size/2)-60; i < (size/2)+60; ++i){
        if(msg_laser_scan.ranges[i] < min){
            min = msg_laser_scan.ranges[i];
        }
    }
    if(min > 1){ //go forward
        geometry_msgs::Twist move;
        move.linear.x = 0.5;
        move.linear.y = 0;
        move.linear.z = 0;
        move.angular.x = 0;
        move.angular.y = 0;
        move.angular.z = 0;

        publisher_.publish(move);
    }
    else{ //turn left
        geometry_msgs::Twist move;
        //rotate around z
        move.linear.x = 0;
        move.linear.y = 0;
        move.linear.z = 0;
        move.angular.x = 0;
        move.angular.y = 0;
        move.angular.z = -1; //not sure if this is right or left

        publisher_.publish(move);
    }
}
